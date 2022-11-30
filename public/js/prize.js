if (window.localStorage.getItem('user_id') === null || window.localStorage.getItem('access_token') === null) {
    Swal.fire({
        icon: 'info',
        title: '請先登入或註冊',
        showConfirmButton: false,
        timer: 1200,
    });
    setTimeout(() => {
        window.location.href = `${DNS}/member.html`;
    }, 1600);
}

const getPrize = async () => {
    try {
        const result = await fetch(`${GENERAL_DNS}/api/${apiVersion}/product/prize`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('access_token')}`,
            },
        });
        const prizeData = await result.json();
        if (prizeData.error) {
            Swal.fire({
                icon: 'info',
                text: `${prizeData.error}`,
            });
            setTimeout(() => {
                window.location.href = `${DNS}/main.html`;
            }, 1600);
        } else {
            Swal.fire({
                icon: 'success',
                title: '恭喜您搶到戰利品',
                showConfirmButton: false,
                timer: 2000,
            });
            $('main').show();
        }
    } catch (error) {
        console.error(error);
    }
};

getPrize();
