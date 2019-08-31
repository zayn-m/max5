import React from 'react';

// import Cover from '../../assets/images/home/cover4.jpg';
// import Cover2 from '../../assets/images/home/cover2.jpg';

import './Home.css';

const home = () => (
	<main>
		{/* <Container fluid>
			<Row>
				<Col className="p-0">
					<img id="bg-img" className="img-fluid" src={Cover} />
				</Col>
			</Row>

			<Row className="border" style={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100%' }}>
				<Col>
					<h1 className="text-center">SECTION 1</h1>
				</Col>
			</Row>

			<Row
				className="border"
				style={{ position: 'absolute', top: 1000, left: 0, height: '100rem', width: '100%' }}
			>
				<Col>
					<h1 className="text-center">SECTION 2</h1>
				</Col>
			</Row>
		</Container> */}

		{/* <section
			style={{
				background: `url(${Cover}) no-repeat center center`,
				backgroundSize: 'cover',
				resize: 'both',

				height: '100vh'
			}}
		>
			<div className="container row h-100">
				<div className="col-6 my-auto  ">
					<button className="btn btn-danger cover-btn">
						<span>GET STARTED </span>
					</button>
					<Button variant="danger cover-btn">GO</Button>
				</div>
			</div>
		</section>
		<section style={{ height: '100rem', backgroundColor: '#4F8DE0' }} /> */}
		{/* <section>
			<div className="row p-0 no-gutters " style={{ position: 'relative' }}>
				<div className="col-12">
					<img
						className="img-fluid"
						style={{ width: '100%', marginLeft: '-1px', position: 'absolute' }}
						src={Cover2}
					/>
					<div className="w-50 ml-auto" style={{ position: 'relative', marginTop: '30rem' }}>
						<div className=" text-right" style={{ marginRight: '20rem' }}>
							<h1>Heading</h1>
							<p>
								It is a long established fact that a reader will be distracted by the readable content
								of a page when looking at its layout. The point of using Lorem Ipsum is that it has a
								more-or-less normal distribution of letters, as opposed to using 'Content here, content
								here', making it look like readable English. Many desktop publishing packages and web
								page editors now use Lorem Ipsum as their default model text, and a search for 'lorem
								ipsum' will uncover many web sites still in their infancy. Various versions have evolved
								over the years, sometimes by accident, sometimes on purpose (injected humour and the
								like).
							</p>
						</div>
					</div>
				</div>
			</div>
		</section> */}
	</main>
);

export default home;
