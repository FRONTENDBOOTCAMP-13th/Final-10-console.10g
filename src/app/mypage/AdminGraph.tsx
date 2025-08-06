import { useLoginStore } from '@/stores/loginStore';
// import { CartCost } from '@/types/Cart';
// import { Product } from '@/types/Product';
// import { getOrders } from '@/utils/getOrders';
import { getUsers } from '@/utils/getUsers';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// 필수 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// type orderData = {
//   createdAt: string;
//   products: Product[];
//   cost: CartCost;
// };

type userData = {
  createAt: string;
  area: string;
};

function getArea(address?: string): string {
  if (!address) return '주소지 없음';

  const words = address.trim().split(' ');
  const firstNonNumber = words.find(w => isNaN(Number(w)));

  return firstNonNumber || '주소지 없음';
}

function aggregateByDate(users: userData[]) {
  const counts: Record<string, number> = {};

  users.forEach(({ createAt }) => {
    const date = createAt.split(' ')[0];
    counts[date] = (counts[date] || 0) + 1;
  });

  // 객체를 차트용 배열로 변환
  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date)); // 날짜 순 정렬
}

function aggregateByArea(users: userData[]) {
  const counts: Record<string, number> = {};

  users.forEach(({ area }) => {
    counts[area] = (counts[area] || 0) + 1;
  });

  // 객체를 차트용 배열로 변환
  return Object.entries(counts).map(([area, count]) => ({ area, count }));
}

export default function AdminGraph() {
  const user = useLoginStore(state => state.user);
  //   const [orderData, setOrderData] = useState<orderData[]>();
  const [showUserSignUpData, setShowUserSignUpData] = useState<{ date: string; count: number }[]>([]);
  const [showUserAreaData, setShowUserAreaData] = useState<{ area: string; count: number }[]>([]);

  useEffect(() => {
    if (!user) return;

    const getUserData = async () => {
      const res = await getUsers();
      if (res.ok) {
        const resUser: userData[] = [];
        for (let i = 0; i < res.item.length; i++) {
          resUser.push({
            area: getArea(res.item[i].address),
            createAt: res.item[i].createdAt,
          });
        }

        const aggregatedDate = aggregateByDate(resUser);
        const aggregatedArea = aggregateByArea(resUser);
        setShowUserSignUpData(aggregatedDate);
        setShowUserAreaData(aggregatedArea);
      } else {
        console.error('유저 정보 불러오기 실패');
      }
    };

    getUserData();
  }, [user]);

  const dataSignUp = {
    labels: showUserSignUpData.map(d => d.date),
    datasets: [
      {
        label: '',
        data: showUserSignUpData.map(d => d.count),
        borderColor: '#a97452',
        fill: false,
      },
    ],
  };
  const dataArea = {
    labels: showUserAreaData.map(d => d.area),
    datasets: [
      {
        label: '',
        data: showUserAreaData.map(d => d.count),
        borderColor: '#a97452',
        fill: false,
      },
    ],
  };

  const maxCountSignUp = Math.max(...showUserSignUpData.map(d => d.count));
  const maxCountArea = Math.max(...showUserAreaData.map(d => d.count));

  const optionsSignUp = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false, // 👈 범례도 숨김
      },
    },
    scales: {
      y: {
        min: 0, // 최소값
        max: maxCountSignUp + 1,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  const optionsArea = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false, // 👈 범례도 숨김
      },
    },
    scales: {
      y: {
        min: 0, // 최소값
        max: maxCountArea + 1,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  // w-full sm:w-[40rem] lg:w-[50rem] bg-white h-full mx-auto px-10 sm:p-10 sm:pb-80 lg:pb-96 sm:rounded-2xl lg:rounded-3xl
  return (
    <section className="flex flex-col flex-nowrap gap-40 pb-40">
      <article className="w-full lg:w-[50rem] mx-auto h-[20rem]">
        {/* 타이틀 */}
        <div className="flex flex-col flex-nowrap px-4 sm:px-0 pb-4">
          <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-secondary-green">날짜별 회원가입 수 분석</h2>
          <p>회원가입한 사용자 수의 분포입니다.</p>
        </div>
        <Line data={dataSignUp} options={optionsSignUp} className="w-full" />
      </article>

      <article className="w-full lg:w-[50rem] mx-auto h-[20rem]">
        {/* 타이틀 */}
        <div className="flex flex-col flex-nowrap px-4 sm:px-0 pb-4">
          <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-secondary-green">지역별 사용자 수 분석</h2>
          <p>사용자들의 거주지 분포입니다.</p>
        </div>
        <Line data={dataArea} options={optionsArea} className="w-full" />
      </article>
    </section>
  );
}
