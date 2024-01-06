import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import * as argon from 'argon2';
import { IUser } from "../types";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    const passwordMatches = await argon.verify(user.password, password);

    if (user && passwordMatches) {
      return user;
    }

    throw new UnauthorizedException('Email or password is incorrect');
  }

  async login(user: IUser) {
    const { id, email } = user;

    return {
      id, email, token: this.jwtService.sign({ id, email })
    };
  }
}
