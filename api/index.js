export default async (req, res) => {
  const { reqHandler } = await import('../dist/por-quanto-eu-vou/server/server.mjs');
  return reqHandler(req, res);
};
