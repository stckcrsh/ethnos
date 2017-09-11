import { EthnosClientPage } from './app.po';

describe('ethnos-client App', () => {
  let page: EthnosClientPage;

  beforeEach(() => {
    page = new EthnosClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
