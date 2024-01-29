import React, { useState, useEffect } from 'react';

type Activity = {
  id: number;
  action: string;
  timestamp: Date;
};

const MyPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  // データを取得するための仮想関数
  const fetchActivities = async () => {
	try {
	  // APIエンドポイントへのリクエスト
	  const response = await fetch('http://localhost:8000/mypageapi', {
		method: 'GET',
		headers: {
		  // 必要に応じてヘッダーを設定
		  'Content-Type': 'application/json',
		  // 認証トークンが必要な場合は以下のように設定
		  // 'Authorization': 'Bearer YOUR_TOKEN_HERE',
		},
		credentials: 'include', // クッキーを使用する場合は必要
	  });
  
	  if (!response.ok) {
		throw new Error('Network response was not ok');
	  }
  
	  // レスポンスデータをJSONとして解析
	  const fetchedActivities = await response.json();
  
	  // 状態を更新
	  setActivities(fetchedActivities);
	} catch (error) {
	  console.error('Fetch activities failed:', error);
	}
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div>
      <h1>マイページ</h1>
      <h2>アクティビティ履歴</h2>
      <ul>
        {activities.map(activity => (
          <li key={activity.id}>
            {activity.action} - {activity.timestamp.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPage;