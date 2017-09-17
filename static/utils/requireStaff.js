import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

export default function requireManager(Component) {
    class StaffComponent extends React.Component {

        static propTypes = {
            isAuthenticated: React.PropTypes.bool.isRequired,
            //isStaff: React.PropTypes.bool.isRequired,
            user: React.PropTypes.object.isRequired,
            location: React.PropTypes.shape({
                pathname: React.PropTypes.string.isRequired
            }).isRequired,
            dispatch: React.PropTypes.func.isRequired
        };

        componentWillMount() {
            this.checkStaff();
        }

        componentWillReceiveProps(nextProps) {
            this.checkStaff();
        }

        checkStaff() {
            if (!this.props.isAuthenticated) {
                const redirectAfterLogin = this.props.location.pathname;
                this.props.dispatch(push(`/login?next=${redirectAfterLogin}`));
            }
            else if (!this.props.user.is_staff) {
                this.props.dispatch(push(`/notfound`));
            }
        }

        render() {
            return (
                <div>
                    {this.props.user.is_staff === true
                        ? <Component {...this.props}/>
                        : null
                    }
                </div>
            );
        }
    }

    const mapStateToProps = (state) => {
        return {
            isAuthenticated: state.auth.isAuthenticated,
            //isStaff: state.auth.isStaff,
            user: state.auth.user,
            token: state.auth.token
        };
    };

    return connect(mapStateToProps)(StaffComponent);
}
