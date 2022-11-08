// Functions that we re-use over and over again in the application
// For example, getting the json() from ReadableStreams and error handling

import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export async function AJAX(url, uploadRecipe = undefined) {
  try {
    const fetchRequest = !uploadRecipe
      ? fetch(url)
      : fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/JSON' },
          body: JSON.stringify(uploadRecipe),
        });

    const res = await Promise.race([fetchRequest, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${data.status}`);

    return data;
  } catch (err) {
    throw err;
  }
}

// export async function getJSON(url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok)
//       // will propogate down to the controller's catch block:
//       //   throw new Error(`We could not find that recipe. Try a new recipe!`);
//       throw new Error(`${data.message} ${data.status}`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// }

// export async function sendJSON(url, uploadRecipe) {
//   try {
//     const postRecipe = fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/JSON' },
//       body: JSON.stringify(uploadRecipe),
//     });

//     const res = await Promise.race([postRecipe, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} ${data.status}`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// }
