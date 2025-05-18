import axios from 'axios';
import forge from 'node-forge';
import { extractImagesAndStrip } from '../utility/utility';

//export const API_BASE_URL = 'https://npvbackend.onrender.com';
const publicKeyPem = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzTcztnOFDFHxVYfGBFa5
SVS00F3t/GKuG3+dsZOeo6USm244hyJpDvWGU2srZcmyIH2R1meendxcBvcUJILQ
JhzMXohMxWlIp+PifVPjqftM+eHE9mYP/WsMz/R8YKsdrg4JuxmmcBJNoYG/MAaX
lZg3sLw5bHEcGtVmYHcq/WIClAaKiHnJyczfQ3r27C6q/dkk3E7q9QDfh8Fgs48r
hx00JvMMBySi2C2uAYs53F4GTGj5ciiXk5W7THklfnpMZsyxpijfjdXZ2agP4KLK
/VtDxIPcNfWSgknjNYpHghi2faQPA9yYr1bwFd8c8yDsEOGXxwm84eC67fnG3Bne
cwIDAQAB
-----END PUBLIC KEY-----
`;

export const dev_API_BASE_URL = 'http://127.0.0.1:8000';


function encryptcredentials(email, password) {
  // const publicKey = forge.pki.publicKeyFromPem(public_Key);
  const data = JSON.stringify({ email, password });
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(data, 'RSA-OAEP', {
    md: forge.md.sha256.create(),           // Hash algorithm for OAEP
    mgf1: {
      md: forge.md.sha256.create(),         // MGF1 hash algorithm
    }
  });

  return forge.util.encode64(encrypted); // Base64-encoded
}
function encryptpostdata(input) {
  // const publicKey = forge.pki.publicKeyFromPem(public_Key);
  const data = JSON.stringify(input);
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(data, 'RSA-OAEP', {
    md: forge.md.sha256.create(),           // Hash algorithm for OAEP
    mgf1: {
      md: forge.md.sha256.create(),         // MGF1 hash algorithm
    }
  });

  return forge.util.encode64(encrypted); // Base64-encoded
}

export async function loginUser(email, password) {
  try {
    const encrypted = encryptcredentials(email, password);

    const response = await axios.post(`${dev_API_BASE_URL}/user/login/`, {
      encrypted, // Send encrypted payload
    });
    return response.data;
  } catch (error) {
    return response || error;
  }
}

export async function post_encryped_data(data, finaldest) {
  try {
    //remove images 
    const { clean, foundImages } = extractImagesAndStrip(data);
    const sensitiveFields = {
      firstname: clean.firstname,
      lastname: clean.lastname,
      password: clean.password,
      phonenumber: clean.profile.phonenumber, // Note: passed directly, not from profile object
    };

    delete clean.firstname;
    delete clean.lastname;
    delete clean.password;

    if (clean.profile) {
      delete clean.profile.phonenumber;
      delete clean.profile.age;
      delete clean.profile.date_of_birth;
    }

    // Encrypt the rest
    console.log(clean)
    const encryptedPayload = encryptpostdata(sensitiveFields);
    console.log(clean);
    const payload = {
      encrypted: encryptedPayload,
      clean: clean,
      // all fields encrypted
      image: foundImages || null       // image stays as base64
    };
    //console.log(payload);
    ///user/signup/
    const response = await fetch(`${dev_API_BASE_URL}${finaldest}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // JSON request
      },
      body: JSON.stringify(payload), // Send JSON data// FormData is automatically handled as multipart/form-data
    });
    return response;
  } catch (error) {
    return response || error;
  }
}

export async function get_article_html(finaldest) {
  const response = await fetch(`${dev_API_BASE_URL}/${finaldest}`)
  if (response.status === 200) {
    const data = await response.json();
    //console.log(data)
    sessionStorage.setItem("html_content", data.html);
    console.log(data)
    return data
  } else {
    return response
  }

}