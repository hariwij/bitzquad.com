<script>
import Head from "$lib/Components/Head.svelte";
import Footer from "$lib/Footer.svelte";
import Navbar from "$lib/Navbar.svelte";

</script>

<Head
	title="Software Development - Services Bitzquad"
	description="Software Development - Powerful, yet intuitive web, desktop and mobile apps"
	keywords="bitzquad, Software Systems, Software Development, Software devolper, owerful, yet intuitive web, desktop and mobile apps, bitzquad services"
/>
<Navbar/>
<main class=" text-slate-600 md:bg-[url('/about-bg.webp')] bg-fixed  bg-cover bg-no-repeat bg-center">
    <div class="py-20 bg-slate-50 bg-opacity-80 backdrop-blur-lg flex flex-col justify-center items-center ">
		<h1
			class="text-4xl md:text-3xl lg:text-4xl xl:text-6xl text-center md:text-left  text-gray-800 font-bold"
		>
            Software Development
		</h1>
		<p class="mt-3 text-center">Powerful, yet intuitive web, desktop and mobile apps</p>
	</div>
    <div class="bz-container bg-slate-50">
		<div class="py-8 xl:py-20  w-full flex flex-col items-center justify-center px-5 lg:flex-row gap-10 container max-w-7xl">
			<div class="w-1/2 lg:flex flex-col justify-center items-center">
				<img src="/services-mobile-side.svg" alt="contact-chatting" class="lg:w-3/4 flex justify-start items-start" />
			</div>
			<div class="w-full lg:w-1/2 flex items-center text-center flex-col">
                <div class="py-4 text-lg">
                    <p class="pt-2 text-center lg:text-left">
						We develop desktop and mobile apps that run on every platform identically using modern technologies. Your app will look and feel the same way on desktops, laptops, and mobile phones.
						These apps outperform the traditional platform-dependent apps.
						
                    </p>
                </div>
			</div>
		</div>
	</div>
</main>
<Footer/>