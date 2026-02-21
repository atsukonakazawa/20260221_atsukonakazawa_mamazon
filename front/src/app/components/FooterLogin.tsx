export default function FooterLogin() {
    return (
        <footer className="mt-10 w-full text-center text-gray-500 text-[0.75rem]">
            {/* 横線 */}
            <hr className="border-t border-gray-300 mb-4" />

            {/* 利用規約 / プライバシー規約 / ヘルプ */}
            <div className="flex justify-center space-x-4 mb-2">
                <a href="#" className="text-[#2162A1] hover:underline">利用規約</a>
                <a href="#" className="text-[#2162A1] hover:underline">プライバシー規約</a>
                <a href="#" className="text-[#2162A1] hover:underline">ヘルプ</a>
            </div>

            {/* コピーライト */}
            <div>
                © 1996-2025, Mamazon.com, Inc. またはその関連会社
            </div>
        </footer>
    );
}
