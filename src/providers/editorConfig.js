import {
  useState,
  useEffect,
  useContext,
  useReducer,
  createContext,
} from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

import {
  CREATE_WORK,
  GET_WORKS,
  UPDATE_WORK_FILE,
  UPDATE_WORK,
} from "../graphql";
import { getSourceDoc } from "../utils";
import { useModal } from "../providers";

const EditorConfigContext = createContext();

const initialState = {
  editor: {
    html: "",
    css: "",
    js: "",
    srcDoc: "",
    workId: "",
  },
  currentWorkName: "",
  isEditingWorkName: false,
  isSaving: false,
  showSaveButton: false,
  savingFunction: () => console.log("default saving function"),
};

// reducer function for EditorConfigProvider
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SAVING":
      return { ...state, isSaving: action.payload };
    case "SET_SHOW_SAVE_BUTTON":
      return { ...state, showSaveButton: action.payload };
    case "SET_EDITOR_CONTENT":
      return { ...state, editor: { ...state.editor, ...action.payload } };
    case "EDIT_WORK_NAME":
      return { ...state, currentWorkName: action.payload };
    case "SET_IS_EDITING_WORK_NAME":
      return { ...state, isEditingWorkName: action.payload };
    default:
      return state;
  }
};

export const EditorConfigProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const { status, data: session } = useSession();
  const { openModal } = useModal();

  // create work
  const [createWork, { loading: isCreatingWork }] = useMutation(CREATE_WORK, {
    onCompleted: ({ createdWork }) => {
      setSaving(false);
      router.push(`/editor/${createdWork.id}`);
      dispatch({ type: "EDIT_WORK_NAME", payload: createdWork.label });
    },
    onError: (error) => {
      setSaving(false);
      console.error(error);
    },
  });

  // update work files mutation
  const [updateWorkFile, { loading: isUpdatingWorkFile }] = useMutation(
    UPDATE_WORK_FILE,
    {
      refetchQueries: ["GET_WORKS"],
      onCompleted: (data) => {
        setSaving(false);
        console.log("updated successfully");
      },
      onError: (error) => {
        setSaving(false);
        console.error(error);
      },
    }
  );

  const [updateWork, { loading: isUpdatingWork }] = useMutation(UPDATE_WORK, {
    onCompleted: ({ updatedWork }) => {
      setIsEditingWorkName(false);
      dispatch({ type: "EDIT_WORK_NAME", payload: updatedWork.label });
      console.log("updated successfully");
    },
    onError: (error) => {
      setIsEditingWorkName(false);
      console.error(error);
    },
  });

  const updateWorkHandler = async (data = {}) => {
    if (status === "authenticated" && session.user && state.editor.workId) {
      await updateWork({
        variables: {
          id: state.editor.workId,
          _set: data,
        },
      });
    }
  };

  const saveUserWorkHandler = async () => {
    if (status === "authenticated" && session.user) {
      setSaving(true);
      if (state.editor.workId) {
        toast.promise(
          Promise.all(
            ["html", "css", "js"].map(async (data) => {
              updateWorkFile({
                variables: {
                  where: {
                    workId: {
                      _eq: state.editor.workId,
                    },
                    type: {
                      _eq: data,
                    },
                  },
                  _set: {
                    content:
                      data === "html"
                        ? state.editor.html
                        : data === "css"
                        ? state.editor.css
                        : data === "js"
                        ? state.editor.js
                        : "",
                  },
                },
                optimisticResponse: true,
                update: (cache) => {
                  const existingWorks = cache.readQuery({ query: GET_WORKS });
                  const updatedWorks = existingWorks.works.map((w) => {
                    if (w.id === state.editor.workId) {
                      return {
                        ...w,
                        files: w.files.map((file) => {
                          return {
                            ...file,
                            content:
                              file.type === data
                                ? data === "html"
                                  ? state.editor.html
                                  : data === "css"
                                  ? state.editor.css
                                  : data === "js"
                                  ? state.editor.js
                                  : ""
                                : file.content,
                          };
                        }),
                      };
                    } else {
                      return w;
                    }
                  });
                  cache.writeQuery({
                    query: GET_WORKS,
                    data: { works: updatedWorks },
                  });
                },
              });
            })
          ),
          {
            loading: "Updating work...",
            success: "Work updated successfully!",
            error: "Error updating work!",
          }
        );
      } else {
        toast.promise(
          createWork({
            variables: {
              object: {
                label: state.currentWorkName || `Work-${new Date().getTime()}`,
                userId: session?.user?.id,
                files: {
                  data: [
                    {
                      type: "html",
                      content: state.editor.html,
                    },
                    {
                      type: "css",
                      content: state.editor.css,
                    },
                    {
                      type: "js",
                      content: state.editor.js,
                    },
                  ],
                },
              },
            },
            optimisticResponse: true,
            update: (cache) => {
              const existingWorks = cache.readQuery({ query: GET_WORKS });
              const newWork = {
                id: `id-${new Date().getTime()}`,
                label: `Work-${new Date().getTime()}`,
                userId: session?.user?.id,
                files: {
                  data: [
                    {
                      id: `file1-${new Date().getTime()}`,
                      type: "html",
                      content: state.editor.html,
                    },
                    {
                      id: `file2-${new Date().getTime()}`,
                      type: "css",
                      content: state.editor.css,
                    },
                    {
                      id: `file2-${new Date().getTime()}`,
                      type: "js",
                      content: state.editor.js,
                    },
                  ],
                },
              };
              cache.writeQuery({
                query: GET_WORKS,
                data: { works: [...existingWorks.works, newWork] },
              });
            },
          }),
          {
            loading: "Creating work...",
            success: "Work created successfully",
            error: "Error creating work",
          }
        );
      }
    } else {
      openModal("login");
    }
  };

  const setSaving = (isSaving) => {
    dispatch({ type: "SET_SAVING", payload: isSaving });
  };
  const setShowSaveButton = (showSaveButton) => {
    dispatch({ type: "SET_SHOW_SAVE_BUTTON", payload: showSaveButton });
  };

  const setEditorContent = (content) => {
    dispatch({ type: "SET_EDITOR_CONTENT", payload: content });
  };

  const editWorkName = (name) => {
    dispatch({ type: "EDIT_WORK_NAME", payload: name });
  };
  const setIsEditingWorkName = (data) => {
    dispatch({ type: "SET_IS_EDITING_WORK_NAME", payload: data });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const result = getSourceDoc({
        html: state.editor.html,
        css: state.editor.css,
        js: state.editor.js,
      });
      dispatch({ type: "SET_EDITOR_CONTENT", payload: { srcDoc: result } });
    }, 250);
    return () => clearTimeout(timeout);
  }, [state.editor.html, state.editor.css, state.editor.js]);

  return (
    <EditorConfigContext.Provider
      value={{
        state,
        setSaving,
        setShowSaveButton,
        setEditorContent,
        saveUserWorkHandler,
        updateWorkHandler,
        editWorkName,
        setIsEditingWorkName,
      }}
    >
      {children}
    </EditorConfigContext.Provider>
  );
};

export const useEditorConfig = () => {
  const context = useContext(EditorConfigContext);
  if (!context)
    throw new Error("useEditorConfig must be used within EditorConfigProvider");
  return {
    editor: context.state.editor,
    isSaving: context.state.isSaving,
    showSaveButton: context.state.showSaveButton,
    currentWorkName: context.state.currentWorkName,
    isEditingWorkName: context.state.isEditingWorkName,
    savingFunction: context.state.savingFunction,
    setSaving: context.setSaving,
    setShowSaveButton: context.setShowSaveButton,
    setEditorContent: context.setEditorContent,
    saveUserWorkHandler: context.saveUserWorkHandler,
    updateWorkHandler: context.updateWorkHandler,
    editWorkName: context.editWorkName,
    setIsEditingWorkName: context.setIsEditingWorkName,
  };
};
