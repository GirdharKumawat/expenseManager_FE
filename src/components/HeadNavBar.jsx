import logo from '../assets/logo2.png';
const HeadNavBar = () => {
    return (
        <header className="bg-emerald-600 p-4 text-white">
            <div className="mx-2 flex max-w-4xl items-center ">
            <img className="h-8 w-8 me-5" src={logo} alt="Expense Manager Logo" />
                <h1 className="text-2xl font-bold">Expense Manager </h1>
            </div>
        </header>
    );
};

export default HeadNavBar;
