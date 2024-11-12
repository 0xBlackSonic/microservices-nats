export const natsLoader = {
  jsManager: {
    streams: {
      add: jest.fn(),
    },
    consumers: {
      add: jest.fn(),
    },
  },
  jsClient: {
    publish: jest
      .fn()
      .mockImplementation((subject: string, data: string) =>
        Promise.resolve({ duplicate: false })
      ),
  },
};
