const FIND_TABLE_QUERY = (tableName) => {
  return `{
    node(id: "Application:${global.APP_ID}") {
      ... on Application {
        table(name: "${tableName}") {
          id
          name
        }
      }
    }
  }`;
};

const getTableId = (name, ctx) => {
  return ctx.graphql.query(FIND_TABLE_QUERY(name))
    .then((result) => {
      if (result.errors ? true : false) {
        if (result.data.node.table === null) {
          console.log('table does not exist');
          return Promise.reject('table does not exist');
        } else {
          return Promise.reject(result.errors[0]);
        }
      }
      return result.data.node.table.id;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

module.exports = {
  getTableId: getTableId
};
