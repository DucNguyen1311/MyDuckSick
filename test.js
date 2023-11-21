const object1 = {
    a: 'somestring',
    b: 42,
  };
  
  console.log(object1);
  for (const [key, value] of Object.entries(object1)) {
    console.log(key + ":" + value);
  }
  
  // Expected output:
  // "a: somestring"
  // "b: 42"