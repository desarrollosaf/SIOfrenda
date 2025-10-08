import { Sequelize } from "sequelize"

const sequelize = new Sequelize('adminplem_saf', 'usr_ofrenda', 'NlTGdIuM3Ao56D2PRM2F', {
    host: '192.168.36.53',
    dialect: 'mysql',
    define: {
        freezeTableName: true 
    }
})
export default sequelize 
 