import { PATHS } from '../../utils/routes';
export default function Navbar() {
	return (
		<div className='navbar bg-base-100'>
			<div className='flex-1'>
				<a className='btn-ghost btn text-xl normal-case' href={PATHS.HOME}>
					CCLito
				</a>
			</div>
			<div className='flex-none'>
				<ul className='menu menu-horizontal px-1'>
					<li>
						<a href={PATHS.FAVORITES}>Favoritos</a>
					</li>
				</ul>
			</div>
		</div>
	);
}
