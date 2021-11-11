// Import the js file to test
import { validURL } from "../src/client/js/validUrl"

// What should I test ? I should test if the url is correct

describe('Test the regex rule', function () {
  test('if is an URL ', function () {
    const urlRGEX = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    const urlTest = 'http://udacity.com:4443/?arg=Alice%26Bob'; //accepted URL
    expect(urlTest).toMatch(urlRGEX);
  });
});
describe('url validation' , () => {
    var url = "Hello Udacity !"; //not accepted URL
    test('if the validRUL works', () => {
      const response = validURL(url); 
      expect(response).toBe(false);
    });
});  



