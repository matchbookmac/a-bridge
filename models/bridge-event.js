module.exports = function (sequelize, DataTypes) {
  var BridgeEvent = sequelize.define(
    'BridgeEvent',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      up_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      down_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    }
  );
  return BridgeEvent;
};