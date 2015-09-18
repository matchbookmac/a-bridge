module.exports = function (sequelize, DataTypes) {
  var ActualEvent = sequelize.define(
    'actualEvent',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      bridgeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      bridge: {
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
  return ActualEvent;
};
