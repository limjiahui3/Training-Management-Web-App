// //this not working for some reason

// import { render, waitFor } from '@testing-library/react';
// import { AuthProvider, useAuth } from './authContext';
// import React from 'react';
// import { expect, test} from '@jest/globals';

// jest.useFakeTimers();

// //dummy
// const DummyComponent = () => {
//     const { isAuthenticated } = useAuth();
//     return React.createElement('div', null , isAuthenticated ? "authenticated" : "not authenticated");
//   };

// test('session timeout after 1 hour', async () => {
//   render(
//     React.createElement(
//       AuthProvider,
//       null,
//       React.createElement(DummyComponent, null)
//     )
//   );

//   jest.advanceTimersByTime(3600000); // Advance time by 1 hour (3600000 milliseconds)

//   await waitFor(() => {
//     expect(console.log).toHaveBeenCalledWith(
//       expect.stringContaining('Session ended at:')
//     );
//   });
// });
