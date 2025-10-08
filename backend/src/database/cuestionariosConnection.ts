import { Sequelize } from "sequelize"

const sequelizeCuestionarios = new Sequelize('adminplem_ofrendas', 'usr_ofrenda', 'NlTGdIuM3Ao56D2PRM2F', {
    host: '192.168.36.53',
    dialect: 'mysql',
    define: {
        freezeTableName: true 
    }
})
export default sequelizeCuestionarios 
