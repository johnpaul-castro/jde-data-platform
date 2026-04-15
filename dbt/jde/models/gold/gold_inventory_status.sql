{{ config(schema='gold', materialized='table') }}

SELECT
    i.item_id,
    i.item_number,
    i.item_description,
    i.unit_of_measure,
    i.gl_class,
    i.product_group,
    b.business_unit,
    b.quantity_on_hand,
    b.quantity_on_order,
    b.cost_average,
    b.price_list,
    ROUND(b.quantity_on_hand * b.cost_average, 2)  AS inventory_value
FROM {{ ref('silver_item_master') }} i
LEFT JOIN {{ ref('silver_item_branch') }} b ON i.item_id = b.item_id
WHERE b.quantity_on_hand > 0
ORDER BY inventory_value DESC
