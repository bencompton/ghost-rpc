describe('Request Hooks', () => {
  describe('When I add no Request Hooks and invoke a service', () => {
    it('should directly execute the service');
  });

  describe('When I add one Request Hook and invoke a service', () => {
    it('should run my Request hook before running the service');

    describe('When I call next() from my Request Hook', () => {
      it('should invoke my service and return an object with a Service Execution Result property');
    });
  });

  describe('When I add two request Hooks and invoke a service', () => {
    describe('When I call next() from the first Request Hook', () => {
      it('should invoke the second Request Hook and return its Service Execution Result payload');
    });

    describe('When I call next() from the second Request Hook', () => {
      it('should invoke my service and return an object with a Service Execution Result property');
    });
  });

  describe('When I call next() more than once from a Request Hook', () => {
    it('should throw an error');
  });
});
