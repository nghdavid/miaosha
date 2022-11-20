window.localStorage.removeItem('pay_token');
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

const id = Number(window.localStorage.getItem('user_id'));

$('#buy').click(async () => {
    const answer = $('#answer').val();
    if (validator.isAlpha(answer)) {
        if (validator.isUppercase(answer)) {
            if (validator.isFullWidth(answer)) {
                Swal.fire({
                    icon: 'info',
                    title: '請輸入半形',
                });
            } else {
                try {
                    const body = {
                        id,
                        question,
                        answer,
                    };
                    const param = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                        body: JSON.stringify(body),
                    };
                    const response = await fetch(`${PUBLISHER_DNS}/api/${apiVersion}/miaosha`, param);
                    const result = await response.json();

                    if (result.error) {
                        Swal.fire({
                            icon: 'info',
                            text: `${result.error}`,
                        });
                    } else if (result.message === '秒殺已結束') {
                        Swal.fire({
                            icon: 'info',
                            text: `${result.message}`,
                        });
                        setTimeout(() => {
                            window.location.href = `${DNS}/failure.html`;
                        }, 1600);
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: '成功送出搶購請求',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                        // 若登入成功，就導向profile page
                        setTimeout(() => {
                            window.location.href = `${DNS}/lookup.html`;
                        }, 1600);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        } else {
            Swal.fire({
                icon: 'info',
                title: '字母要大寫',
            });
        }
    } else {
        Swal.fire({
            icon: 'info',
            title: '只能有英文字母',
        });
    }
});
