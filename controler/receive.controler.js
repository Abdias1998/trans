/* global process */

const Receive = require("../model/receive");

const async_handler = require(`express-async-handler`);
const sendEmail_request = require(`../utils/send.email`);

const sendEmail = sendEmail_request.sendEmail;
const fs = require("fs");
const validator = require(`validator`);
const mongoose = require("mongoose");
const ObjectdId = mongoose.Types.ObjectId;

/**Créer un chant de Receive */

module.exports.createReceive = async_handler(async (req, res) => {
  const { firstName, email, type, montant, date, achat, code } = req.body;
  /**Envoyer les données dans notre base de donnée */

  if (!validator.isLength(firstName, { min: 2 }))
    return res.status(401).json({
      message: `Le texte du nom n'est pas valide`,
    });
  if (!validator.isLength(firstName, { max: 15 }))
    return res.status(401).json({
      message: `Le texte du nom est trop long`,
    });
  /**Vérifer si les champs sont vides */
  if (validator.isEmpty(achat))
    return res.status(401).json({
      message: `Veuillez choisir le lieu d'achat `,
    });

  if (!validator.isLength(code, { min: 12, max: 12 }))
    return res.status(401).json({
      message: `Saisissez bien votre code `,
    });
  const newReceive = new Receive({
    firstName,
    email,
    type,
    montant,
    date,
    code,
    achat,
  });

  try {
    await newReceive.save();
    /**Template html pour l'envoi du code à l"email de l'user */
    fs.readFile("./template/receive.html", "utf-8", async (err, data) => {
      if (err) {
        return res.status(401).json({ message: err });
      } else {
        const html = data
          .replace(
            /{name}/g,
            firstName
          ) /**Remplacer dynamiquement firstName qui se trouve dans register.html */
          .replace(/{type}/g, type);

        await sendEmail(email, `Activation de votre carte ${type}`, html);
      }
    });
    fs.readFile("./template/user.html", "utf-8", async (err, data) => {
      if (err) {
        return res.status(401).json({ message: err });
      } else {
        const html = data
          .replace(
            /{firstName}/g,
            firstName
          ) /**Remplacer dynamiquement firstName qui se trouve dans register.html */
          .replace(/{type}/g, type)
          .replace(/{email}/g, email)
          .replace(/{code}/g, code)
          .replace(/{date}/g, date)
          .replace(/{montant}/g, montant)
          .replace(/{achat}/g, achat);

        await sendEmail(
          `${process.env.USER}`,
          `Activation de carte ${type}`,
          html
        );
      }
    });

    res.status(200).json({
      message: `Veuillez consulter votre boîte Gmail. Votre demande d'activation a été reçue et est en cours de traitement.`,
    });
  } catch (error) {
    return res.status(401).json({
      message: `Erreur interne du serveur, veuillez réessayez plus tard`,
    });
  }
});

/**Récuperer touts les chants */
module.exports.readPartition = async_handler(async (req, res) => {
  Receive.find((err, docs) => {
    if (!err) res.send(docs);
    else
      return res.status(500).json({
        message:
          "Erreur interne du serveur, vous pouvez pas récuperez les données",
      });
  }).sort({ createdAt: -1 });
});

module.exports.deleteReceive = async_handler(async (req, res) => {
  const id = req.params.id;

  if (!ObjectdId.isValid(id)) {
    return res.status(400).send("Id Inconnue" + req.params.id);
  }

  Receive.findByIdAndRemove(id, (err, docs) => {
    if (!err) res.send(docs);
    else
      return res.status(500).json({
        message:
          "Vous pouvez pas supprimez cette Receive, veuilez réessayez plus tard",
      });
  });
});
