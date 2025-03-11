const {display, addItem} = require('./grocerytracker');

test('list at the start should be:  ', () => {
  expect(display()).toEqual([]);
});


test('item to be added:  ', () => {
    expect(addItem('apple', 10, 20)).toEqual({itemname: 'apple',quantity: 10,price: 20,bought: false});
  });