
const tableUtils = require('./datastore/table');

const storeHandler = (req, res, ctx) => {
  const TABLE_NAME = 'volume-viz';
  tableUtils.getTableId(TABLE_NAME, ctx).then(id => {
    const usersTable = ctx.datastore.table(id);

    const { data } = JSON.parse(req.body);
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


/**
 * Entry point for a request
 * We are handling routing here based on URL path
 *
 * Base case returns 400 (bad request)
 */
exports.routeHandler = storeHandler(req, res, ctx);