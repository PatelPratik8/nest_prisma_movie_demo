import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { DatabaseService } from "@app/database/database.service";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: DatabaseService
  ) {}
  async signIn(email: string, pass: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(pass, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { name: user.name, role: user.role, id: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async signUp(userInfo) {
    const userData = await this.prisma.user.findFirst({
      where: { email: userInfo.email },
    });
    if (userData) {
      throw new HttpException("user already exist", HttpStatus.NOT_ACCEPTABLE);
    }
    
    const hash = await bcrypt.hash(userInfo.password, 10);
    const user = await this.createUser(
      userInfo.name,
      userInfo.email,
      hash,
      "User"
    );
    const payload = { name: user.name, role: user.role, id: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async createUser(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<any> {
    return this.prisma.user.create({
      data: { name, email, password, role: role as any },
    });
  }
}
