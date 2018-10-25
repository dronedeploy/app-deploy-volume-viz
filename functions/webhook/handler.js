
const tableUtils = require('./datastore/table');
const TABLE_NAME = 'volume-viz-v1';

exports.routeHandler = function (req, res, ctx) {
  tableUtils.getTableId(TABLE_NAME, ctx).then(id => {
    const usersTable = ctx.datastore.table(id);
    console.log('req.body', req.body);
    console.log('req.body', typeof req.body);
    // const data = JSON.parse(req.body);
    const data = req.body;
    console.log('data', data);
    const urlSegments = req.path;
    console.log('urlSegments', urlSegments);
    const annotationId = urlSegments.slice(1);
    console.log('annotationId', annotationId);
    const externalId = `ann-${annotationId}`;
    switch (req.method) {
      case 'POST':
        usersTable
          .upsertRow(externalId, data)
          .then(result => {
            if (!result.ok) { console.warn("UpsertRow failed", result.errors); }
            usersTable
              .getRowByExternalId(externalId)
              .then(result => {
                console.log("/post result", result);
                if (!result.ok) { console.warn("GetRowByExternalId data failed", result.errors); }
                res.status(200).send({ result, externalId });
              })
          })
        break;
      case 'GET':
        usersTable
          .getRowByExternalId(externalId)
          .then(result => {
            console.log("/get result", result);
            if (!result.ok) { console.warn("Get data failed", result.errors); }
            res.status(200).send({ result });
          })
        break;
      default:
        res.status(404).send({ error: "Not Found" });
        break;
    }
  });
};
