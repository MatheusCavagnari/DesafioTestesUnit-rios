import { GetStatementOperationError } from "./GetStatementOperationError";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });
  it("Should be able to get a statement operation", async () => {
    const userR = {
      name: "teste",
      email: "rteste@gmail.com",
      password: "123123",
    };
    const user = await usersRepositoryInMemory.create(userR);

    const statementR = {
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      description: "teste",
      amount: 300,
    };
    const statement = await statementsRepositoryInMemory.create(statementR);

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    expect(response.amount).toBe(300);
    expect(response.description).toBe("teste");
  });

  it("Shouldn't be able to get statement operation of a non-existent user", async () => {
    expect(async () => {
      const userR = {
        name: "teste",
        email: "rteste@gmail.com",
        password: "123123",
      };
      const user = await usersRepositoryInMemory.create(userR);

      const statementR = {
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        description: "teste de deposito",
        amount: 300,
      };
      const statement = await statementsRepositoryInMemory.create(statementR);
      await getStatementOperationUseCase.execute({
        user_id: "testee",
        statement_id: statement.id as string,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
  it("Shouldn't be able to get statement operation of a non-existent statement", async () => {
    expect(async () => {
      const userR = {
        name: "teste",
        email: "rteste@gmail.com",
        password: "123123",
      };
      const user = await usersRepositoryInMemory.create(userR);

      const statementR = {
        user_id: user.id as string,
        type: OperationType.DEPOSIT,
        description: "teste",
        amount: 300,
      };
      const statement = await statementsRepositoryInMemory.create(statementR);
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "testee",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
