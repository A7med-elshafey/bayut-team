import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";

const MOTIVATIONAL_MESSAGES = {
  "elshafey": "اليوم هو يومك الجديد، مليء بالتحديات والفرص. أنت قادر على تحقيق النجاح والتفوق. ابدأ يومك بطاقة إيجابية وابتسامة مشرقة. 💪🌟",
  "boss": `Good morning BOSS🌟
Your leadership, guidance, and support inspire the entire team every day. Because of your vision and encouragement, we are confident that the team will rise to every challenge and achieve great success. Thank you for believing in us and guiding us toward excellence. 💼💪🚀`,
  "khorim": "ابدأ يومك بطاقة إيجابية 🌟",
  "atheer": "صباح الفل اثير , اليوم هو فرصة جديدة لإثبات قدراتك. استغل كل لحظة لتحقيق أهدافك. أنت نجم في سماء المبيعات. ✨🚀",
  "ahmed": "صباح الفل يا كبير , اليوم هو يومك. استمتع بكل لحظة وحقق أهدافك بثقة. أنت قائد في مجالك. 🌹📊",
  "moustafa": "صباح الفل يعم مصطفي , يومك كله رزق ونشاط ان شاء الله وجهز نفسك للاجازه بس عاوزين بيعه الاول قبل ما تنزل والنهارده هو اليوم المناسب لكدا , انت تقدر🌟💪",
  "naelsalti": "Good Morning, mr.nael, Wishing you a day full of positivity and excellence as always! 🌟 Today is your day to create even more successes. Keep shining and showing the amazing talent that makes you truly exceptional! 💪✨🏆",
  "sarah": "صباح الفل برنسيسه ساره , يوم جديد، فرصة جديدة. استمتعي بكل لحظة وحققي أهدافك بثقة. أنتِ مصدر إلهام للجميع. 🌸💼",
  "faisal": "صباح الفل يا فيصل , يوم جديد، فرصة جديدة لقيادة الفريق نحو النجاح. بفضل رؤيتك وجهودك، نحن على الطريق الصحيح. استمر في إلهامنا وتحفيزنا. 🌟📈 شيخ الشيوخ ",
  "raghad": "الملكة رغد صباح الف , أتمنى لك يومًا مليئًا بالإيجابية والإبداع كعادتك! اليوم فرصتك لتحقيق المزيد من النجاحات، أنتِ مصدر إلهام دائم للجميع 🌟💪",
  "mohamed": "صباح الفل يا صاحبي , اليوم هو يومك الجديد، مليء بالتحديات والفرص. أنت قادر على تحقيق النجاح والتفوق. ابدأ يومك بطاقة إيجابية وابتسامة مشرقة. 💪🌟",
  "mohamed.jamal": "صباح الفل يا كبير , يوم جديد، فرصة جديدة لقيادة الفريق نحو النجاح. بفضل رؤيتك وجهودك، نحن على الطريق الصحيح. استمر في إلهامنا وتحفيزنا. 🌟📈",
  "danishnawaz": "Good Morning Danish, ہمیشہ کی طرح آپ کے دن کو مثبت اور شاندار بننے کی دعا ہے! 🌟 آج کا دن آپ کی کامیابیوں میں اضافہ کرنے کا موقع ہے۔ اپنی صلاحیتوں سے سب کو حیران کریں! 🏆🚀",
  "talal": "صباح الورد يا طلال , أتمنى لك يومًا مليئًا بالإيجابية والتميز كعادتك! اليوم فرصتك لصنع المزيد من النجاحات، أنت مميز جدًا وتستحق كل الإنجازات 💪🏆🚀",
  "emadsubh": "صباح الفل يا ابو ميرا , اليوم هو يومك الجديد، مليء بالتحديات والفرص. أنت قادر على تحقيق النجاح والتفوق. ابدأ يومك بطاقة إيجابية وابتسامة مشرقة. 💪🌟كالعادة",
  "saleh411": "صباح الفل يا صالح ,اليوم هو فرصتك لتثبت لنفسك مدى قدرتك على النجاح 🌟💪🚀",
  "mohamedelshafey": "عم الشافعي صباحك فل يا كبير , ثق بقدراتك ولا تدع أي شيء يوقفك، اليوم هو يومك لتسطع 🌟💪🔥",
  "saad": "صباح الفل يا اخوي سعد , اليوم فرصتك لصنع المزيد من النجاحات، أنت مميز جدًا وتستحق كل الإنجازات 💪🏆🚀",
  "doaalafy": "برنسيسه دعاء صباح الفل ,اليوم يومك لتتألقي وتحققي أهدافك بثقة وطاقة إيجابية ✨🏆🌷 ",
  "nedhal": "الملكة نضال صباح الفل , أتمنى لك يومًا مليئًا بالإيجابية والإبداع كعادتك! اليوم فرصتك لتحقيق المزيد من النجاحات، أنتِ مصدر إلهام دائم للجميع 💖🌟💪",
  "shoug": "صباح الفل ملكة شوق , أتمنى لك يومًا مليئًا بالإيجابية والإبداع كعادتك! اليوم فرصتك لتحقيق المزيد من النجاحات، أنتِ مصدر إلهام دائم للجميع 💖🌟💪",
  "samy": "صباح الفل يا كبير , يوم جديد، فرصة جديدة لقيادة الفريق نحو النجاح. بفضل رؤيتك وجهودك، نحن على الطريق الصحيح. استمر في إلهامنا وتحفيزنا. 🌟📈",
  "rawan99": "الملكة روان صباح الفل , يوم جديد، فرصة جديدة. استمتعي بكل لحظة وحققي أهدافك بثقة. أنتِ مصدر إلهام للجميع. 🌸💼",
  "afnan": "الملكه افنان , يوم جديد، فرصة جديدة. استمتعي بكل لحظة وحققي أهدافك بثقة. أنتِ مصدر إلهام للجميع. 🌸💼",
  "wafa": "خالتي وفاء صباح الفل , خلاص هانت وهتنزلي اجازة خلي الايام اللي باقيه كلها تميز وابداع كالعادة النهارده يومك لصنع انجاز ✨🏆🌷",
};

export default function WelcomeOverlay() {
  const { showWelcome, session } = useAuth();
  const [visible, setVisible] = useState(false);

useEffect(() => {
  let timer;
  if (showWelcome && session) {
    setVisible(true);
  } else {
    timer = setTimeout(() => setVisible(false), 1);
  }
  return () => clearTimeout(timer);
}, [showWelcome, session]);


  if (!visible) return null;

  // هات الرسالة بناءً على اليوزر، لو مش موجودة رجّع رسالة افتراضية
  const message =
    MOTIVATIONAL_MESSAGES[session?.username] ||
    "خليك دايمًا في أفضل نسخة منك 🌈";

  return (
    <div
      className={`fixed inset-0 z-[1100] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-500 ${
        showWelcome ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-full max-w-lg bg-gradient-to-br from-green-100 via-white to-blue-100 backdrop-blur-md border border-white/70 shadow-2xl rounded-3xl p-10 text-center transition-transform duration-500 transform animate-in fade-in zoom-in">
        <div className="mx-auto h-20 w-20 rounded-full bg-green-200 flex items-center justify-center shadow-lg">
          <span className="text-4xl">✅💪</span>
        </div>
        <h3 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-wide">
          Welcome
        </h3>
        <p className="mt-2 text-xl font-semibold text-gray-800">
          {session?.fullName || session?.name}
        </p>
        {/* الرسالة التحفيزية */}
        <p className="mt-4 text-lg font-medium text-gray-700 italic">
          {message}
        </p>
      </div>
    </div>
  );
}
