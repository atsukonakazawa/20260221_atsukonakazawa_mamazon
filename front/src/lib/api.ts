
//チェックユーザー(ユーザーがいるかの確認)
export async function checkUser(emailOrPhone: string) {
  const res = await fetch('http://localhost/api/check-user', {
    method: 'POST',
    // JSON を送るので Content-Type を指定
    headers: {
      'Content-Type': 'application/json',
    },
    // Laravel 側では Request $request->email で受け取る
    body: JSON.stringify({
      email: emailOrPhone,
    }),
  });

  if (!res.ok) {
    throw new Error('checkUser failed');
  }

  // { exists: boolean } が返る想定
  return res.json();
}

//SMS認証コード送信
export async function sendSmsCode(payload: {
  tel: string;
}): Promise<{ message: string; debug_code?: number }> {

  const res = await fetch('http://localhost/api/sms/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('sms send failed');
  }

  return res.json();
}

//SMS認証コード検証（仮）
export async function verifySmsCode(payload: {
  tel: string;
  code: string;
}): Promise<{ success: boolean }> {
  const res = await fetch('http://localhost/api/sms/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return { success: false };
  }

  return { success: true };
}

// アカウント登録
//登録時に送るデータの型
//👉 SignupForm / LoginPage / api.ts で共通認識にする
type RegisterPayload = {
  email: string;
  tel: string;      // メール or 電話番号
  password: string;     // パスワード
  first_name: string;
  last_name: string;
  postcode?: string;
  address?: string;
  date_of_birth?: string;
  placement?: boolean;
  place_of_placement?: string;
};

export async function registerUser(data: RegisterPayload) {
  const res = await fetch('http://localhost/api/register', {
    method: 'POST',
    // JSON を送るので Content-Type を指定
    headers: {
      'Content-Type': 'application/json',
    },
    // Laravel 側では Request $request->xxx で受け取る
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('register failed');
  }

  // { message, user }
  return res.json();
}

// ログイン
export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const res = await fetch('http://localhost/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // 403 も含めて呼び出し側で処理したい
  if (!res.ok) {
    const errorData = await res.json();
    throw {
      status: res.status,
      message: errorData.message,
    };
  }

  return res.json();
}



