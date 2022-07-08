import { CreateUserError } from "./CreateUserError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  it("Should be able to create a user", async () => {
    const userR = {
      name: "teste",
      email: "rteste@gmail.com",
      password: "123123",
    };
    const user = await createUserUseCase.execute(userR);

    expect(user).toHaveProperty("id");
  });

  it("Shouldn't be able to create a usar with the same email", async () => {
    expect(async () => {
      const userR = {
        name: "teste",
        email: "rteste@gmail.com",
        password: "123123",
      };
      await createUserUseCase.execute(userR);
      await createUserUseCase.execute(userR);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
