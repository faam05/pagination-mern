import User from '../models/UserModel.js';
import { Op } from 'sequelize';

export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const offset = limit * page;
  const totalRows = await User.count({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: '%' + search + '%',
          },
        },
        {
          email: {
            [Op.like]: '%' + search + '%',
          },
        },
      ],
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  const results = await User.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: '%' + search + '%',
          },
        },
        {
          email: {
            [Op.like]: '%' + search + '%',
          },
        },
      ],
    },
    offset: offset,
    limit: limit,
    order: [['id', 'DESC']],
  });

  res.json({
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
    data: results,
  });
};
