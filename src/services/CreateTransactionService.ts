import { getCustomRepository, getRepository } from 'typeorm';

// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome') {
      if (balance.total - value < 0)
        throw new AppError('Not possible add this transaction', 400);
    }

    const verifyIfCategoryExists = await categoriesRepository.findOne({
      where: { title: category },
    });

    let newCategory;

    if (!verifyIfCategoryExists) {
      newCategory = categoriesRepository.create({ title: category });
      await categoriesRepository.save(newCategory);
    } else {
      newCategory = verifyIfCategoryExists;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: newCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
