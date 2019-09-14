import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';

import DashboardCard from '../../components/DashboardCard/DashboardCard';
import { getChartData, getDashboardData } from '../../firebase/firebaseUtils';

class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this._isMounted = false;
	}

	state = {
		revenue: 0,
		orders: 0,
		subscribers: 0,
		chartData: null
	};

	componentDidMount() {
		this._isMounted = true;
		this._isMounted &&
			getDashboardData().then((res) => {
				this._isMounted &&
					this.setState({ revenue: res.totalRevenue, orders: res.totalOrders, subscribers: res.subscribers });
			});
		this._isMounted && this.getChartData();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	getChartData = () => {
		getChartData().then((res) => {
			this._isMounted &&
				this.setState({
					chartData: {
						labels: [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ],
						datasets: [
							{
								label: 'SALES',
								data: [
									res['01'],
									res['02'],
									res['03'],
									res['04'],
									res['05'],
									res['06'],
									res['07'],
									res['08'],
									res['09'],
									res['10'],
									res['11'],
									res['12']
								],
								backgroundColor: [
									'rgba(255, 99, 132, .6)',
									'rgba(54, 162, 235, .6)',
									'rgba(255, 206, 192, .6)',
									'rgba(75, 192, 192, .6)',
									'rgba(150, 99, 130, .6)',
									'rgba(255, 159, 64, .6)',
									'rgba(138, 99, 132, .6)',
									'rgba(255, 89, 99, .6)',
									'rgba(100, 23, 150, .6)',
									'rgba(196, 194, 194)',
									'rgba(55, 99, 132, .6)',
									'rgba(5, 71, 163, .6)'
								]
							}
						]
					}
				});
		});
	};

	render() {
		const { revenue, orders, subscribers } = this.state;
		return (
			<section className="dashboard-container m-3">
				<h2>Dashboard</h2>
				<div className="row p-0 no-gutters">
					<DashboardCard title={'Total Revenue'} data={`$${revenue}`}>
						<i className="fas fa-hand-holding-usd" />
					</DashboardCard>
					<DashboardCard title={'Total Orders'} data={orders}>
						{' '}
						<i className="fas fa-handshake" />
					</DashboardCard>
					<DashboardCard title={'Subscribers'} data={subscribers}>
						{' '}
						<i className="fas fa-users" />
					</DashboardCard>
				</div>
				{this.state.chartData && (
					<div className="row m-5 chart">
						<div className="col-md-8">
							<Bar
								data={this.state.chartData}
								height={300}
								options={{
									maintainAspectRatio: false,
									title: { display: true, text: 'YEARLY SALES', fontSize: 25 },
									legend: { display: true, position: 'right' }
								}}
							/>
						</div>
						<div className="col-md-4">
							<Pie data={this.state.chartData} height={300} />
						</div>
					</div>
				)}
			</section>
		);
	}
}

export default Dashboard;
