import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import { LoginInputType } from "./LoginInputType";
import { User } from "./../../../entity/User";
import { compare } from "bcryptjs";
import { LoginResponse } from "./LoginResponse";
import { MyContext } from "../../../utils/MyContext";
import {
  createRefreshToken,
  createAccessToken
} from "../../../utils/createTokens";

@Resolver()
export class LoginResolver {
  @Mutation(() => LoginResponse)
  async login(
    @Arg("data") loginInput: LoginInputType,
    @Ctx() { res, req }: MyContext
  ): Promise<LoginResponse> {
    console.log("req.headers.authorization: ", req.headers.authorization);
    console.log("req.headers.cookie: ", req.headers.cookie);

    const user = await User.findOne({ where: { email: loginInput.email } });

    if (!user) {
      throw new Error("Could not find User");
    }

    const valid = await compare(loginInput.password, user.password);

    if (!valid) {
      throw new Error("Bad password");
    }

    //Referesh Token
    res.cookie("userId", createRefreshToken(user), {
      httpOnly: true
    });

    return {
      accessToken: createAccessToken(user)
    };
  }
}
