router.post(
    '/crear-servicio',
    authMiddleware,
    roleMiddleware('admin'),
    crearServicio
);

module.exports = router;