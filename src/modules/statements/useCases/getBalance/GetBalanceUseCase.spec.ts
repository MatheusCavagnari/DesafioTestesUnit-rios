import { GetBalanceError } from "./GetBalanceError";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Balance", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });
  it("Should be able to get the balance", async () => {
    const userD = {
      name: "teste",
      email: "teste@gmail.com",
      password: "12345",
    };
    const user = await usersRepositoryInMemory.create(userD);

    const statementDTO = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      description: "teste",
      amount: 300,
    };
    const statement = await statementsRepositoryInMemory.create(statementDTO);

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(response.balance).toBe(300);
  });

  it("Shouldn't be able to get balance of a nnot existent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "testee" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
