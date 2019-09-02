import React from 'react';

import './ProductDetail.css';
import { getProductByCategory, getRecommendations } from '../../firebase/firebaseUtils';
import { connect } from 'react-redux';
import { addItem } from '../../store/actions/cart';

import ZoomableImage from 'react-zoomable-image';
import Card from '../../components/Card/Card';
import Skelton from '../../components/Skelton/Skelton';

class ProductDetail extends React.Component {
	state = {
		product: null,
        loaded: false,
        recommendations: []
    };
    
 

	componentDidMount() {
		const category = this.props.match.params.category;
		const id = this.props.match.params.productId;
        getProductByCategory(category, id).then((res) => this.setState({ product: res }));
        this.recommendations();
	}

    recommendations = async () => {
        await  getRecommendations().then(res => this.setState({recommendations: res, loaded: true}))
        
    }

    selectItemHandler = (category, id) => {
        const url = `http://localhost:3000/shop/${category}/${id}`;
        window.open(url, '_blank');
    }


	render() {
		const { product, loaded } = this.state;
		return (
			<div className="container">
                

                {
                    !loaded ? 
                    <Skelton /> :
                    <div>
                    <section className="row border-bottom product-detail" >
						<div className="col-md-6">
							<h1>{product.name}</h1>
							<p>{product.description}</p>
							<h2>
								<strong>${product.price}</strong>
							</h2>
							<br />
							<button
								className="btn btn-danger"
								onClick={() => this.props.addItem(product, this.props.currentUser)}
							>
								Add to Cart
							</button>
						</div>
						<div className="col-md-6">
							<ZoomableImage
								baseImage={{
									alt: product.name,
									src: product.imageUrl,
									width: 550,
									height: 550
								}}
								largeImage={{
									alt: 'A large image',
									src: product.imageUrl,
									width: 750,
									height: 750
								}}
								thumbnailImage={{
									alt: 'A small image',
									src: product.imageUrl
								}}
							/>
						</div>
					</section>

                    <section className=" mt-5 mb-5">
                       
                       <h4 className="mb-5">Recommendations for you</h4>
                       <div className="row m-5">
                           {
                               this.state.recommendations.items.map(item => (
                                <Card key={item.id} item={item} clicked={() => this.selectItemHandler(this.state.recommendations.title, item.id)}  />
                               ))
                           }
                         
                          
                       </div>
                   
                   </section>
                    </div>
                }

				
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	currentUser: state.userReducer.currentUser
});

const mapDispatchToProps = (dispatch) => ({
	addItem: (item, currentUser) => dispatch(addItem(item, currentUser))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
