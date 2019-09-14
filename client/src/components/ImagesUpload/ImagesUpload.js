import React from 'react';
import { connect } from 'react-redux';
import { addVariations } from '../../store/actions/addProduct';

class ImagesUpload extends React.Component {
	state = {
		files: [],
		images: []
	};

	componentDidMount() {
		if (this.props.images) {
			this.props.addVariations(this.props.images);
			this.setState({ images: this.props.images, files: this.props.images });
		}
	}

	upload(e) {
		e.preventDefault();
		document.getElementById('selectImage').click();
	}

	fileSelectedHandler = (e) => {
		this.setState(
			{
				files: [ ...this.state.files, ...e.target.files ],
				images: [ ...this.state.images, URL.createObjectURL(...e.target.files) ]
			},
			() => this.props.addVariations(this.state.files)
		);
	};

	removePicture = (img, index) => {
		this.props.addVariations(this.props.images);
		this.setState(
			{
				images: this.state.images.filter((image) => image !== img),
				files: this.state.files.filter((file, i) => i !== index)
			},
			() => this.props.addVariations(this.state.files)
		);
	};

	render() {
		return (
			<form>
				<h4>Select Variations</h4>
				<div className="row">
					{this.state.images.map((image, index) => (
						<div className="col-4 col-md-3 bg-white border m-2 " key={index}>
							<img className="img-fluid" src={image} alt="" />
							<div className="overlay">
								<i
									className="fas fa-times-circle"
									style={{ cursor: 'pointer' }}
									title="Remove Picture"
									onClick={() => this.removePicture(image, index)}
								/>
							</div>
						</div>
					))}
				</div>
				<button className="btn btn-light border" onClick={this.upload}>
					<i className="fas fa-upload" /> Upload
				</button>
				<input id="selectImage" type="file" hidden onChange={this.fileSelectedHandler} />
			</form>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	addVariations: (variations) => dispatch(addVariations(variations))
});

export default connect(null, mapDispatchToProps)(ImagesUpload);
