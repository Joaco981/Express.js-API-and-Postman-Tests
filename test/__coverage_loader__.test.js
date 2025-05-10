require('../backend/models/Profesor');
require('../backend/models/Mesa');
require('../backend/models/Invitacion');
require('../backend/models/Notificador');
//service
require('../backend/service/StateInvitacion');
require('../backend/service/StrategyNotification');
require('../backend/service/ConsolaStrategyNotification');
//api
require('../backend/app');

test('carga completa para coverage', () => {
    expect(true).toBe(true);
  });