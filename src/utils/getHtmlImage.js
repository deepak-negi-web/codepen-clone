import axios from "axios";
export const getHtmlImage = async (works) => {
  const updatedWork = await Promise.all(
    works.map(async (work) => {
      const html = work.files.find((file) => file.type === "html").content;
      const css = work.files.find((file) => file.type === "css").content;
      const js = work.files.find((file) => file.type === "js").content;
      const fullContent = `<style>${css}</style>${html}<script>${js}</script>`;
      const { data } = await axios("/api/htmlToImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          html: fullContent,
        },
      });
      return {
        ...work,
        showContentImg: data.imageBase64,
      };
    })
  );
  return updatedWork;
};
