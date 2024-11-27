import './Profile.css';


function Profile(){
    return(
        <>
            <div class="profile">
                <div className="profile__top">

                </div>
                <div className="profile__bottom">
                    <div className="profile__card">
                        <div className="profile__image">
                            <img src="https://st.quantrimang.com/photos/image/2021/08/16/Anh-vit-cute-6.jpg" alt="" />
                        </div>
                        <div className="profile__info">
                            <div className="profile__name">
                                Vũ Danh Phong - B21DCCN590
                            </div>
                            <ul className="profile__social">
                                <li >
                                    <a className="profile__instagram" href="#" target='blank'>
                                        <i class="fa-brands fa-instagram"></i>
                                    </a>
                                </li>
                                <li >
                                    <a className="profile__github" href="#"
                                    target='blank'>
                                        <i class="fa-brands fa-github"></i>
                                    </a>
                                </li>
                            </ul>
                            <div className="profile__social2">
                                <div className="profile__git">
                                    <label>Github</label>
                                    
                                    <a href="#" target='blank'>
                                         <input type="text" value={`#`}>
                                        
                                    </input>
                                    </a>
                                </div>
                                <div className="profile__api">
                                    <label >Apidoc</label>
                                    <a href="#" target='blank'>
                                        <input type="text" value={`#`} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </>
    )
};
export default Profile;



{/* <div class="profile__picture">
    <div class="profile__title">
        Profile picture
    </div>
    <div class="profile__image">
        <div class="profile__img">
            <img src="https://images.unsplash.com/photo-1625181067043-42eff3270801?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym95fGVufDB8fDB8fHww" alt="avatar"/>
        </div>
        <div className='profile__button'>
            <button className='button button__change'>Change picture</button>
        </div>
        <div className='profile__button'>
            <button className='button button__delete'>Delete picture</button>
        </div>
    </div>
</div>
<div class="profile__content">
    <div class="profile__name">
        <label for="name">Profile name</label>
        <input id="name" type="text" value="Lâm Tiến Dưỡng"/>
    </div>
    <div class="profile__class">
        <label for="class">Class</label>
        <input id="class" type="text" value="B21DCCN290"/>
    </div>
    <div class="profile__github">
        <label for="github">Github</label>
        <input type="text" id="github"/>
    </div>
    <div class="profile__apidoc">
        <label for="apidoc">API doc</label>
        <input type="text" id="apidoc"/>
    </div>
    
</div> */}