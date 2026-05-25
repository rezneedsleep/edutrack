async function test() {
  try {
    const baseUrl = 'http://localhost:3000';
    
    // 1. Get CSRF token
    console.log("Fetching CSRF token...");
    const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
    const csrfData = await csrfRes.json();
    const csrfToken = csrfData.csrfToken;
    const cookies = csrfRes.headers.getSetCookie();
    console.log("CSRF Token:", csrfToken);
    console.log("CSRF Cookies:", cookies);

    // Find the cookie that contains the csrfToken value
    let correctCsrfCookie = '';
    for (const cookie of cookies) {
      if (cookie.includes('authjs.csrf-token') && cookie.includes(csrfToken)) {
        correctCsrfCookie = cookie.split(';')[0];
        break;
      }
    }
    
    // If not found (just in case), fall back to the last one
    if (!correctCsrfCookie) {
      const csrfCookiesList = cookies.filter(c => c.includes('authjs.csrf-token'));
      if (csrfCookiesList.length > 0) {
        correctCsrfCookie = csrfCookiesList[csrfCookiesList.length - 1].split(';')[0];
      }
    }

    const callbackUrlCookie = cookies.find(c => c.includes('authjs.callback-url'))?.split(';')[0] || '';
    
    const cookieHeaders = [correctCsrfCookie, callbackUrlCookie].filter(Boolean).join('; ');
    console.log("Cookie headers to send:", cookieHeaders);

    // 2. Sign in
    console.log("Signing in...");
    const signInBody = new URLSearchParams({
      email: 'admin@davinn.net',
      password: 'davin123',
      csrfToken: csrfToken,
      redirect: 'false',
      callbackUrl: '/dashboard'
    });

    const signInRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookieHeaders,
        'Host': 'localhost:3000',
        'Origin': 'http://localhost:3000',
        'Referer': 'http://localhost:3000/login',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      body: signInBody.toString()
    });

    console.log("Sign in Status:", signInRes.status);
    const signInCookies = signInRes.headers.getSetCookie();
    console.log("Sign in Cookies:", signInCookies);

    // Find the session token
    let sessionCookie = '';
    for (const cookie of signInCookies) {
      if (cookie.includes('authjs.session-token') || cookie.includes('next-auth.session-token')) {
        sessionCookie = cookie.split(';')[0];
        break;
      }
    }
    console.log("Session Cookie:", sessionCookie);

    if (!sessionCookie) {
      console.log("Failed to get session cookie. Sign in response body:");
      console.log(await signInRes.text());
      return;
    }

    // Join all sign-in cookies and csrf cookies
    const allSessionCookies = [sessionCookie, correctCsrfCookie].join('; ');

    // 3. Request /dashboard/admin/users
    console.log("Requesting /dashboard/admin/users...");
    const pageRes = await fetch(`${baseUrl}/dashboard/admin/users`, {
      headers: {
        'Cookie': allSessionCookies,
        'Host': 'localhost:3000'
      },
      redirect: 'manual'
    });

    console.log("Response Status:", pageRes.status);
    console.log("Response Headers:");
    pageRes.headers.forEach((val, key) => {
      console.log(`  ${key}: ${val}`);
    });
    
    const body = await pageRes.text();
    console.log("Response Body (first 1000 chars):");
    console.log(body.substring(0, 1000));
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
