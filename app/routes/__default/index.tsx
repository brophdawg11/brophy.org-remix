import ExternalLink from '~/components/ExternalLink';

export const handle = {
    isHomepage: true,
};

export default function Homepage() {
    return (
        <div className="c-home-content">
            <img
                src="/images/logo.png"
                className="c-home-logo"
                alt="Matt Brophy Logo"
                width="75"
                height="101"
            />

            <h1>Matt Brophy</h1>

            <p className="c-home-description">
                web developer at&nbsp;
                <ExternalLink to="https://remix.run" title="Remix">
                    remix
                </ExternalLink>
                &nbsp;💿
            </p>

            <p className="c-home-description">
                <span>enjoys sports, beer, coffee, and coding</span>
                <span className="c-home-description-dash">&mdash;</span>
                <br className="c-home-description-break" />
                <span>order of preference depends on day and time</span>
            </p>
        </div>
    );
}
