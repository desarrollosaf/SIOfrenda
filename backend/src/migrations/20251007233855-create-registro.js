'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('registros', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre_edificio: {
        type: Sequelize.STRING
      },
      ubicacion: {
        type: Sequelize.STRING
      },
      rfc_responsable: {
        type: Sequelize.STRING
      },
      nombre_responsable: {
        type: Sequelize.STRING
      },
      cargo: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      },
      correo: {
        type: Sequelize.STRING
      },
      cargo: {
        type: Sequelize.STRING
      },
      descripcion_lugar: {
      type: Sequelize.TEXT('long') 
      },
      piso_area: {
        type: Sequelize.TEXT('long') 
      },
      acepto: {
      type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('registros');
  }
};