/* nunjucks template */

require.config({{ requirejs | json(4) }});

require({{deps | json(4) }}, function(domReady, angular) {
    
    domReady(function(doc) {
        angular.module('cordovaSimulator.api', [
    {%- for api in apis %}
            'cordovaSimulator.api.{{ api }}',
    {%- endfor %}
        ]);

        angular.bootstrap(doc, ['cordovaSimulator']);
    });
    
});