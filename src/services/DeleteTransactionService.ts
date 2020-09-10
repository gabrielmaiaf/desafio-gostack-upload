import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id?: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const targetTransaction = await transactionsRepository.findOne(id);

    if (!targetTransaction) throw new AppError('Transaction not exist', 401);

    await transactionsRepository.remove(targetTransaction);
  }
}

export default DeleteTransactionService;
