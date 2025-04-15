const Pool = require("../models/Pool");
const User = require("../models/User");

// Criar um bolão
exports.createPool = async (req, res) => {
  try {
    const { name } = req.body;

    const pool = new Pool({
      name,
      owner: req.user._id,
      participants: [req.user._id],
    });

    await pool.save();

    // atualiza o usuário
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { pools: pool._id },
    });

    res.status(201).json(pool);
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar bolão." });
  }
};

// Entrar em um bolão
exports.joinPool = async (req, res) => {
  try {
    const { poolId } = req.params;
    const pool = await Pool.findById(poolId);

    if (!pool) {
      return res.status(404).json({ message: "Bolão não encontrado." });
    }

    if (pool.participants.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "Você já participa deste bolão." });
    }

    pool.participants.push(req.user._id);
    await pool.save();

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { pools: pool._id },
    });

    res.json({ message: "Entrou no bolão com sucesso.", pool });
  } catch (err) {
    res.status(500).json({ message: "Erro ao entrar no bolão." });
  }
};

// Listar bolões do usuário
exports.getMyPools = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("pools");
    res.json(user.pools);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar bolões." });
  }
};
