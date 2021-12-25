import bcrypt from "bcrypt";
import { apolloClient } from "../../lib/apolloClient";
import { CREATE_USER } from "../../graphql";

const SALT_ROUNDS = 10;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name = "", email = "", password = "" } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    //  create a new user entry in the user table
    const {
      data: { createdUser = {} },
    } = await apolloClient.mutate({
      mutation: CREATE_USER,
      variables: {
        object: { name, email, password: hash },
      },
    });

    // console.log({ insertCustomer })
    if (createdUser && createdUser.id) {
      return res
        .status(200)
        .json({ success: true, message: "Successfully created a new user" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Error creating user" });
  }
}
