import React from 'react';
import html2canvas from 'html2canvas';

import { namePng, isEmpty } from '../../utils';

const Export = ({bannerConfig, bannerBlock}) => {
    
    const disabled = isEmpty(bannerConfig);

    const handlerClickPNG = _ => {
    
        html2canvas(bannerBlock).then(canvasBannerBlock => {

            const nameToDownload = namePng();

            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(canvasBannerBlock.msToBlob(), nameToDownload);
            } else {
                const a = document.createElement('a');
                a.style.display = 'none';
                a.download = nameToDownload;
                a.href = canvasBannerBlock.toDataURL('image/png');
                
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        });
    };

    const handlerClickHTML = _ => {
        
        html2canvas(bannerBlock).then(canvasBannerBlock => {

            const dataURI = canvasBannerBlock.toDataURL('image/png');
            let html;

            if (bannerConfig.link) {
                html = `<a href="${bannerConfig.link}">
                    <img src="${dataURI}" />
                </a>`;
            } else {
                html = `<img src="${dataURI}" />`;
            }

            if (typeof(navigator.clipboard) === 'undefined') {
                alert('Конфигурация баннера не может быть скопирована в буфер обмена, т.к. отсутствует безопастное подключение');
            } else {
                navigator.clipboard.writeText(html);
                alert('HTML разметка баннера скопирована в буфер обмена');
            }

        });
    };

    const handlerClickJSON = _ => {
        const parse = JSON.stringify(bannerConfig);
        if (typeof(navigator.clipboard) === 'undefined') {
            alert('Конфигурация баннера не может быть скопирована в буфер обмена, т.к. отсутствует безопастное подключение');
        } else {
            navigator.clipboard.writeText(parse);
            alert('Конфигурация баннера скопирована в буфер обмена');
        }
    };

    const methods = [
        {value: 'PNG', handler: handlerClickPNG},
        {value: 'HTML', handler: handlerClickHTML},
        {value: 'JSON', handler: handlerClickJSON}
    ];

    return (
        <React.Fragment>
            {methods.map(({value, handler}) => {
                return (
                    <ButtonExport 
                        key={value}
                        value={value}
                        onClick={handler}
                        disabled={disabled}
                    />
                );
            })}
        </React.Fragment>
    );
};

const ButtonExport = ({value,onClick,disabled}) => {

    return (
        <div className="form__item--small">
            <input
                className={`button button--small ${disabled ? 'button--disabled' : ''}`}
                type="button"
                value={value}
                onClick={onClick}
                disabled={disabled}
            />
        </div>
    );
};

export default Export;